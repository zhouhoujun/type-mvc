import { createModelDecorator, IModelDecorator } from './Model';
import { ModelMetadata } from '../metadata/index';

export const Entity: IModelDecorator<ModelMetadata> = createModelDecorator<ModelMetadata>('Entity');
