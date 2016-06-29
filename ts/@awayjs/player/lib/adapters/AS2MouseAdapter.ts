export class AS2MouseAdapter
{
    private static _globalListeners : Array<Object> = [];

    // this does nothing really, just to catch usage in scripts
    public static addListener(listener:Object)
    {
        AS2MouseAdapter._globalListeners.push(listener);

        // TODO: Init actual mouse events here, relative to root MovieClip (I suppose?)
    }
}