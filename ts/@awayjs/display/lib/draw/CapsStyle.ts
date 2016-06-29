/**
 * The CapsStyle class is an enumeration of constant values that specify the
 * caps style to use in drawing lines. The constants are provided for use as
 * values in the <code>caps</code> parameter of the
 * <code>flash.display.Graphics.lineStyle()</code> method. You can specify the
 * following three types of caps:
 */
export class CapsStyle
{
	/**
	 * Used to specify round caps in the <code>caps</code> parameter of the
	 * <code>flash.display.Graphics.lineStyle()</code> method.
	 */
	public static ROUND:number = 1;

	/**
	 * Used to specify no caps in the <code>caps</code> parameter of the
	 * <code>flash.display.Graphics.lineStyle()</code> method.
	 */
	public static NONE:number = 0;

	/**
	 * Used to specify square caps in the <code>caps</code> parameter of the
	 * <code>flash.display.Graphics.lineStyle()</code> method.
	 */
	public static SQUARE:number = 2;
}