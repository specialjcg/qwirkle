import {Color} from '../../domain/Color';
import {Form} from '../../domain/Form';

export interface Tiles {
    rackPosition: number;
    id: number;
    color: Color;
    form: Form;
}
