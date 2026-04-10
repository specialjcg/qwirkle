# Qwirkle

Implémentation web complète du jeu Qwirkle avec un backend Rust performant, un frontend Elm fonctionnel, et un bot IA basé sur AlphaZero (Graph Transformer + MCTS).

## Aperçu

- **Multijoueur** : 2 à 4 joueurs (humains ou bots) en temps réel via SSE
- **Bot greedy** : recherche exhaustive des coups, choix gourmand par score
- **Bot neural** : Graph Transformer entraîné par self-play AlphaZero, guidé par MCTS
- **Vue 2D et 3D** : SVG classique ou rendu Three.js (table de feutrine, tuiles en relief)
- **Mode spectateur** : regarder bot vs bot

## Architecture

```
┌──────────────┐         ┌─────────────────┐         ┌──────────────┐
│  Frontend    │  HTTPS  │   Backend Rust  │  SQLite │   Database   │
│  Elm + SVG/  │ ◄─────► │   (axum)        │ ◄─────► │              │
│  Three.js    │   SSE   │                 │         │              │
└──────────────┘         └────────┬────────┘         └──────────────┘
                                  │
                                  │ tch (libtorch)
                                  ▼
                         ┌─────────────────┐
                         │  Neural Bot     │
                         │  GT + MCTS      │
                         │  (CPU/GPU)      │
                         └─────────────────┘
```

### Stack technique

| Couche       | Technologie                       |
|--------------|-----------------------------------|
| **Frontend** | Elm 0.19 (SVG) + Three.js (3D)    |
| **Backend**  | Rust + axum + SQLx + SQLite       |
| **Realtime** | Server-Sent Events (SSE)          |
| **Auth**     | JWT + argon2                      |
| **IA**       | Graph Transformer (tch/libtorch) + MCTS AlphaZero |
| **Build**    | cargo + elm make (`./start.sh`)   |

## Structure du projet

```
qwirkle/
├── backend/                      # Rust + axum
│   ├── src/
│   │   ├── main.rs               # entrée serveur
│   │   ├── api/                  # handlers HTTP
│   │   │   ├── auth.rs           # login / register / guest
│   │   │   ├── game.rs           # create / list / spectate / delete
│   │   │   ├── action.rs         # play / swap / skip / bot dispatch
│   │   │   └── sse.rs            # event stream
│   │   ├── domain/               # logique métier pure
│   │   │   ├── rules.rs          # validation + scoring
│   │   │   ├── ai.rs             # bot greedy
│   │   │   ├── neural_bot.rs     # bot neural + MCTS (lazy load)
│   │   │   ├── game.rs / player.rs / tile.rs
│   │   │   └── color.rs / shape.rs
│   │   ├── neural/               # NN (feature "neural")
│   │   │   ├── graph_transformer.rs   # modèle GT + heads
│   │   │   ├── mcts.rs                # Monte Carlo Tree Search
│   │   │   ├── tensor_conversion.rs   # encode plateau → tenseurs
│   │   │   └── model_io.rs            # save/load .pt
│   │   ├── db/repository.rs      # accès SQLite
│   │   ├── sse/                  # broker événements
│   │   └── bin/                  # binaires de training
│   │       ├── selfplay.rs       # génération de données greedy/neural
│   │       ├── train_bot.rs      # training value+policy heads
│   │       ├── evaluate.rs       # éval vs greedy (avec ou sans MCTS)
│   │       ├── alphazero.rs      # boucle complète selfplay→train→arena
│   │       └── distill.rs        # teacher → student pour CPU
│   ├── tests/
│   │   ├── api_integration.rs    # intégration HTTP
│   │   └── rules_compliance.rs   # 36 tests règles officielles Qwirkle
│   └── migrations/001_initial.sql
├── frontend/                     # Elm + SVG + Three.js
│   ├── src/
│   │   ├── Main.elm              # router + state global
│   │   ├── Page/                 # Login, Register, Lobby, Opponents, Game, Waiting
│   │   ├── View/                 # Board, Tile, Rack, Scoreboard
│   │   ├── Types/                # Color, Shape, Tile, Player, Game
│   │   ├── Api/                  # client HTTP (Action, Auth, Game, ...)
│   │   ├── Sse.elm               # décodage événements
│   │   └── Port.elm              # interop JS (SSE, localStorage, 3D)
│   └── static/
│       ├── index.html            # bootstrap Elm + import 3D module
│       ├── style.css             # design system dark
│       └── js/
│           ├── three-scene.js    # scène Three.js
│           └── tile-geometry.js  # génération textures tuiles
├── start.sh                      # build + run dev
└── README.md
```

## Règles Qwirkle (résumé)

- **108 tuiles** : 6 couleurs × 6 formes × 3 copies
- **Lignes** : max 6 tuiles, toutes de **même couleur** (formes uniques) **OU même forme** (couleurs uniques)
- **Pas de doublons** dans une même ligne
- **Premier coup** : doit passer par l'origine (0, 0)
- **Adjacence** : chaque tuile placée doit toucher au moins une tuile existante (sauf 1er coup)
- **Multi-tuile** : toutes sur la même ligne/colonne, contiguës
- **Scoring** : 1 point par tuile dans chaque ligne formée ; **Qwirkle = ligne de 6 → +6 pts bonus** (12 total)
- **Cross-scoring** : une tuile qui touche 2 lignes compte pour les 2
- **Fin** : quand un joueur vide son rack et le bag est vide → +6 pts bonus

74 tests Rust (`backend/tests/rules_compliance.rs` + `domain/rules.rs`) couvrent l'intégralité des règles, dont les edge cases (gap-check pour les placements multi-tuile).

## IA : du greedy au neural network

### Bot greedy (`bot1`)

Recherche exhaustive de tous les placements légaux 1-tuile et 2-tuiles, sélection du score immédiat le plus haut. Très rapide (~1 ms/coup), niveau correct.

### Bot neural (`bot2`)

**Architecture : Graph Transformer + MCTS** (style AlphaZero)

```
État du plateau → Graph Transformer → (value, policy)
                       │                     │
                       │                     ▼
                       │              MCTS guidé par policy
                       │                     │
                       ▼                     ▼
                  Évaluation         Distribution sur coups légaux
                  scalaire                    │
                  (-1 à +1)                   ▼
                                       Coup choisi
```

#### Graph Transformer

- **Input** : nœuds = tuiles occupées + cellules candidates voisines (max 128 nœuds)
- **22 features par nœud** : couleur (6) + forme (6) + flags occupé/candidat (3) + position normalisée (2) + voisin count (1) + lignes H/V (4)
- **4 layers, 4 heads, d_model=64**, attention masquée pour padding
- **Value head** : mean-pool + context → MLP → tanh ∈ [-1, +1]
- **Policy head** : per-node MLP → logits sur 36 faces de tuile

#### MCTS (PUCB)

```
score(child) = Q(child) + c_puct × P(child) × √N(parent) / (1 + N(child))
```

À chaque simulation : **select → expand → evaluate (NN) → backup**.

Pour Qwirkle (information partielle), on utilise une **détermisation** simple : le bag et la main adverse ne sont pas modélisés explicitement, MCTS opère sur l'état visible.

### Pipeline AlphaZero

```
1. Self-play (NN + MCTS vs NN + MCTS)  →  samples (state, π_visits, z_outcome)
2. Train candidate (loss = MSE_value + CE_policy)
3. Arena : candidate vs best_so_far     →  win_rate
4. If win_rate >= 55% → candidate becomes new best
5. Goto 1
```

Boucle complète dans `bin/alphazero.rs`.

### Distillation (CPU)

Le teacher (~1.4 M params) est distillé vers un student (~150 K params, 32 dims, 2 layers) pour inférence rapide CPU :

```
loss = α · KL(student ‖ teacher, T=4) + (1−α) · MSE(value)
```

`bin/distill.rs`

## Démarrage

### Prérequis

- **Rust** stable (cargo, rustc)
- **Elm 0.19**
- **libtorch 2.4.x** (pour le bot neural, feature `neural`)

```bash
# Premier lancement
cd qwirkle
./start.sh
```

Le script :
1. Compile Elm → `frontend/static/elm.js`
2. Compile Rust release → `backend/target/release/qwirkle-backend`
3. Lance le serveur sur `:3001`

Ouvre `http://localhost:3001`, crée un compte (ou guest), et joue contre **Greedy** ou **Neural** depuis le lobby.

### Variables d'environnement

| Var               | Défaut             | Description                          |
|-------------------|--------------------|--------------------------------------|
| `PORT`            | 3001               | Port HTTP                            |
| `STATIC_DIR`      | ../frontend/static | Dossier static servi                 |
| `QWIRKLE_MODEL`   | models/v1.pt       | Chemin du modèle neural pour `bot2`  |

### Bot neural en jeu

Le serveur charge le modèle au démarrage (`models/v1.pt` par défaut). Si absent, le bot neural fallback sur greedy. Logs au démarrage :

```
INFO Neural bot loaded from models/v1.pt on Cpu
```

30 simulations MCTS par coup → ~500 ms latence CPU acceptable.

## Training

Avec la feature `neural` activée :

```bash
cd backend

# 1. Self-play bootstrap (greedy vs greedy)
cargo run --features neural --release --bin selfplay -- \
    --games 2000 --out data/bootstrap.bin

# 2. Train value + policy heads
cargo run --features neural --release --bin train_bot -- \
    --data data/bootstrap.bin --epochs 100 --batch 128 \
    --out models/v1.pt

# 3. Eval vs greedy (sans MCTS)
cargo run --features neural --release --bin evaluate -- \
    --model models/v1.pt --games 100

# 4. Eval vs greedy (avec MCTS)
cargo run --features neural --release --bin evaluate -- \
    --model models/v1.pt --games 100 --mcts 50

# 5. AlphaZero loop (selfplay → train → arena)
cargo run --features neural --release --bin alphazero -- \
    --iterations 10 --selfplay-games 100 --mcts-sims 80 \
    --arena-games 30 --out-dir models/az --init-model models/v1.pt

# 6. Distillation teacher → student (CPU)
cargo run --features neural --release --bin distill -- \
    --teacher models/teacher.pt --data data/bootstrap.bin \
    --epochs 50 --out models/student.pt
```

### Sur GPU distant

Tout le pipeline fonctionne sur CPU **et** GPU. Sur une machine GPU avec libtorch CUDA :

```bash
LD_LIBRARY_PATH=~/libtorch-cuda/libtorch/lib:$LD_LIBRARY_PATH \
    ./target/release/alphazero --iterations 10 \
    --selfplay-games 100 --mcts-sims 80 \
    --arena-games 30 --out-dir models/az
```

`tch` détecte automatiquement CUDA via `Device::cuda_if_available()`.

## Tests

```bash
cd backend
cargo test --lib                      # 38 tests unitaires
cargo test --test rules_compliance    # 36 tests règles
cargo test --test api_integration     # tests HTTP end-to-end
```

## Vue 3D

Toggle **2D / 3D** dans le header de la page de jeu. La 3D est rendue par Three.js dans un canvas, l'état est synchronisé depuis Elm via ports (`sendSceneState`, `set3DViewEnabled`). Voir `frontend/static/js/three-scene.js`.

- Tapis vert style casino
- Tuiles en blocs 3D avec textures procédurales (canvas) sur la face supérieure
- Drop targets en pointillés or pour le placement
- Rack incliné posé sur la table
- Orbit controls (clic-drag) + zoom molette

## Mode spectateur

Bouton **"Watch: Greedy vs Neural"** dans le lobby crée une partie où **les deux joueurs sont des bots** (`bot1` et `bot2`). L'utilisateur connecté est référencé comme `spectator_user_id` dans la table `games` et reçoit le flux SSE sans pouvoir agir.

## Roadmap

- [ ] Drag & drop des tuiles (2D + 3D)
- [ ] MCTS avec déterminisations multiples (info imparfaite)
- [ ] Politique douce : utiliser la distribution des visites MCTS comme target (vrai AlphaZero)
- [ ] Distillation vers ONNX pour inférence ultra-rapide
- [ ] Mode tournoi : modèles versionnés s'affrontent

## Licence

Projet personnel.
