/**
 * Defines the values to use for specifying path-drawing commands.
 * The values in this class are used by the Graphics.drawPath() method,
 *or stored in the commands vector of a GraphicsPath object.
 */
export class GraphicsPathCommand
{
	/**
	 * Represents the default "do nothing" command.
	 */
	public static NO_OP:number = 0;
	/**
	 * Specifies a drawing command that moves the current drawing position
	 * to the x- and y-coordinates specified in the data vector.
	 */
	public static MOVE_TO:number = 1;

	/**
	 * Specifies a drawing command that draws a line from the current drawing position
	 * to the x- and y-coordinates specified in the data vector.
	 */
	public static LINE_TO:number = 2;

	/**
	 *  Specifies a drawing command that draws a curve from the current drawing position
	 *  to the x- and y-coordinates specified in the data vector, using a control point.
	 */
	public static CURVE_TO:number = 3;
	/**
	 *  Specifies a drawing command that draws a curve from the current drawing position
	 *  to the x- and y-coordinates specified in the data vector, using a control point.
	 */
	public static BUILD_JOINT:number 		= 13;
	public static BUILD_ROUND_JOINT:number 	= 14;

	/**
	 * Specifies a "line to" drawing command,
	 * but uses two sets of coordinates (four values) instead of one set.
	 */
	public static WIDE_LINE_TO:number = 4;

	/**
	 *   Specifies a "move to" drawing command,
	 *   but uses two sets of coordinates (four values) instead of one set.
	 */
	public static WIDE_MOVE_TO:number = 5;

	/**
	 * Specifies a drawing command that draws a curve from the current drawing position
	 * to the x- and y-coordinates specified in the data vector, using 2 control points.
	 */
	public static CUBIC_CURVE:number = 6;
}
export default GraphicsPathCommand;