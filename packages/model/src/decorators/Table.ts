import { createModelDecorator, IModelDecorator } from './Model';
import { ModelMetadata } from '../metadata';

export const Table: IModelDecorator<ModelMetadata> = createModelDecorator<ModelMetadata>('Table');
