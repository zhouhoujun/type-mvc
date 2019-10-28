import { isMetadataObject } from '@tsdi/ioc';
import { ComponentSelectorHandle, RefSelector } from '@tsdi/components';

export class StrategySelectorHandle extends ComponentSelectorHandle {
    protected getSelector(template: any, refSelector?: RefSelector): any {
        return isMetadataObject(template) ? template.strategy : null;
    }
}
