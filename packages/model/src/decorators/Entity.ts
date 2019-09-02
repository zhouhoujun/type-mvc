import { createModelDecorator, IModelDecorator } from './Model';
import { ModelMetadata } from '../metadata';

/**
 * Entity decorator.
 */
export const Entity: IModelDecorator<ModelMetadata> = createModelDecorator<ModelMetadata>('Entity');
