
interface ISubscriber {
    next(value: CustomEvent): any;
    // error(error: any): any;
    // complete(): any;
}

export { ISubscriber };
