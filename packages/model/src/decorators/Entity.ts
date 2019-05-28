import { createModelDecorator, IModelDecorator } from './Model';
import { ModelMetadata } from '../metadata';

export const Entity: IModelDecorator<ModelMetadata> = createModelDecorator<ModelMetadata>('Entity');
