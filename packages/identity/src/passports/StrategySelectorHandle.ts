import { ComponentSelectorHandle, RefSelector } from '@tsdi/components';
import { isMetadataObject } from '@tsdi/ioc';

export class StrategySelectorHandle extends ComponentSelectorHandle {
    protected getSelector(template: any, refSelector: RefSelector): any {
        return isMetadataObject(template) ? template.strategy : null;
    }
}
