
export const metadata = {
    template: './METADATA/DECORATOR/UNDEFINED/TEMPLATE',
    styles: './METADATA/DECORATOR/UNDEFINED/STYLES',
    call(element) {
        element.dataset.template = this.template;
        element.dataset.styles = this.styles;
        return element;
    }
};
