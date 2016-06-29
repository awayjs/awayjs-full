/**
 * The JointStyle class is an enumeration of constant values that specify the
 * joint style to use in drawing lines. These constants are provided for use
 * as values in the <code>joints</code> parameter of the
 * <code>flash.display.Graphics.lineStyle()</code> method. The method supports
 * three types of joints: miter, round, and bevel, as the following example
 * shows:
 */
export class JointStyle
{
	/**
	 * Specifies beveled joints in the <code>joints</code> parameter of the
	 * <code>flash.display.Graphics.lineStyle()</code> method.
	 */
	public static BEVEL:number = 2;

	/**
	 * Specifies mitered joints in the <code>joints</code> parameter of the
	 * <code>flash.display.Graphics.lineStyle()</code> method.
	 */
	public static MITER:number = 0;

	/**
	 * Specifies round joints in the <code>joints</code> parameter of the
	 * <code>flash.display.Graphics.lineStyle()</code> method.
	 */
	public static ROUND:number = 1;
}