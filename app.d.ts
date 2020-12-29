// declare function require(params:string): any;

declare module '*.html' {
    var content: string;
    export default content;
}

declare module '*.md' {
    var content: string;
    export default content;
}

declare module 'raw-loader!*' {
    var content: string;
    export default content;
}

declare module '!!raw-loader!*' {
    var contents: string;
    export default contents;
}
