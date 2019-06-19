import { ComponentSelectorHandle } from '@tsdi/components';
import { isMetadataObject } from '@tsdi/ioc';

export class StrategySelectorHandle extends ComponentSelectorHandle {
    protected getSelector(template: any): any {
        return isMetadataObject(template) ? template.strategy : null;
    }
}
