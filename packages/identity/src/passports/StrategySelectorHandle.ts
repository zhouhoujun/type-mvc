import { isMetadataObject } from '@tsdi/ioc';
import { ComponentSelectorHandle, ComponentProvider } from '@tsdi/components';

export class StrategySelectorHandle extends ComponentSelectorHandle {
    protected getSelector(template: any, compdr?: ComponentProvider): any {
        return isMetadataObject(template) ? template.strategy : null;
    }
}
