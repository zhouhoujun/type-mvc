import { createModelDecorator, IModelDecorator } from './Model';
import { ModelMetadata } from '../metadata/index';

export const Table: IModelDecorator<ModelMetadata> = createModelDecorator<ModelMetadata>('Table');
