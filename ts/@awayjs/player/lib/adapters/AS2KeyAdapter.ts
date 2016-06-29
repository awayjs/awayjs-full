export class AS2KeyAdapter
{
    private static _keys:Array<boolean> = new Array<boolean>();
    private static _key:number;
    private static _char:number;

    public static _listeners:Array<any> = new Array<any>();

    private static _addListeners = (function () {
        if (document) {
            document.onkeydown = (event:KeyboardEvent) => AS2KeyAdapter._onKeyDown(event);
            document.onkeyup = (event:KeyboardEvent) => AS2KeyAdapter._onKeyUp(event);
        }
    })();

    public static addListener(listener:any)
    {
        AS2KeyAdapter._listeners.push(listener);
    }

    public static removeListener(listener:any)
    {
        var listeners:Array<any> = AS2KeyAdapter._listeners;
        var index:number = listeners.indexOf(listener);

        if (index != -1)
            listeners.splice(index, 1);
    }

    public static isDown(code:number):boolean
    {
        return AS2KeyAdapter._keys[code];
    }

    public static getCode():number
    {
        return AS2KeyAdapter._key;
    }

    public static getAscii():number
    {
        return AS2KeyAdapter._char;
    }

    /**
     * Constant associated with the key code value for the Backspace key (8).
     */
    public static BACKSPACE:number = 8;

    /**
     * Constant associated with the key code value for the Caps Lock key (20).
     */
    public static CAPSLOCK:number = 20;

    /**
     * Constant associated with the key code value for the Control key (17).
     */
    public static CONTROL:number = 17;

    /**
     * Constant associated with the key code value for the Delete key (46).
     */
    public static DELETEKEY:number = 46;

    /**
     * Constant associated with the key code value for the Down Arrow key (40).
     */
    public static DOWN:number = 40;

    /**
     * Constant associated with the key code value for the End key (35).
     */
    public static END:number = 35;

    /**
     * Constant associated with the key code value for the Enter key (13).
     */
    public static ENTER:number = 13;

    /**
     * Constant associated with the key code value for the Escape key (27).
     */
    public static ESCAPE:number = 27;

    /**
     * Constant associated with the key code value for the Home key (36).
     */
    public static HOME:number = 36;
    
    /**
     * Constant associated with the key code value for the Insert key (45).
     */
    public static INSERT:number = 45;

    /**
     * Constant associated with the key code value for the Left Arrow key (37).
     */
    public static LEFT:number = 37;

    /**
     * Constant associated with the key code value for the Page Down key (34).
     */
    public static PGDN:number = 34;

    /**
     * Constant associated with the key code value for the Page Up key (33).
     */
    public static PGUP:number = 33;

    /**
     * Constant associated with the key code value for the Right Arrow key (39).
     */
    public static RIGHT:number = 39;

    /**
     * Constant associated with the key code value for the Shift key (16).
     */
    public static SHIFT:number= 16;

    /**
     * Constant associated with the key code value for the Spacebar (32).
     */
    public static SPACE:number = 32;

    /**
     * Constant associated with the key code value for the Tab key (9).
     */
    public static TAB:number = 9;

    /**
     * Constant associated with the key code value for the Up Arrow key (38).
     */
    public static UP:number = 38;
    

    private static _onKeyDown(event:KeyboardEvent)
    {
        AS2KeyAdapter._key = event.keyCode;
        AS2KeyAdapter._char = event.charCode;
        AS2KeyAdapter._keys[event.keyCode] = true;

        var len:number = AS2KeyAdapter._listeners.length;
        for (var i:number = 0; i < len; i++)
            if (AS2KeyAdapter._listeners[i].onKeyDown)
                AS2KeyAdapter._listeners[i].onKeyDown();
    }

    private static _onKeyUp(event:KeyboardEvent)
    {
        AS2KeyAdapter._keys[event.keyCode] = false;

        var len:number = AS2KeyAdapter._listeners.length;
        for (var i:number = 0; i < len; i++)
            if (AS2KeyAdapter._listeners[i].onKeyUp)
                AS2KeyAdapter._listeners[i].onKeyUp();
    }
}