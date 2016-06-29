import {BitmapImage2D}			from "@awayjs/core/lib/image/BitmapImage2D";
import {Matrix}					from "@awayjs/core/lib/geom/Matrix";

import {CapsStyle}				from "../draw/CapsStyle";
import {GradientType}				from "../draw/GradientType";
import {GraphicsPathWinding}		from "../draw/GraphicsPathWinding";
import {IGraphicsData}			from "../draw/IGraphicsData";
import {InterpolationMethod}		from "../draw/InterpolationMethod";
import {JointStyle}				from "../draw/JointStyle";
import {LineScaleMode}			from "../draw/LineScaleMode";
import {TriangleCulling}			from "../draw/TriangleCulling";
import {SpreadMethod}				from "../draw/SpreadMethod";

import {Style}					from "../base/Style";
import {Graphics}					from "../graphics/Graphics";
import {Graphic}					from "../graphics/Graphic";
import {GraphicsPath}				from "../draw/GraphicsPath";
import {GraphicsPathCommand}		from "../draw/GraphicsPathCommand";
import {DefaultMaterialManager}	from "../managers/DefaultMaterialManager";
import {MovieClip}				from "../display/MovieClip";

import {Point}					from "@awayjs/core/lib/geom/Point";
import {AttributesBuffer}			from "@awayjs/core/lib/attributes/AttributesBuffer";
import {AttributesView}			from "@awayjs/core/lib/attributes/AttributesView";
import {Sprite}					from "../display/Sprite";
import {Float3Attributes}			from "@awayjs/core/lib/attributes/Float3Attributes";
import {Float2Attributes}			from "@awayjs/core/lib/attributes/Float2Attributes";

import {MathConsts}				from "@awayjs/core/lib/geom/MathConsts";

import {GraphicsFactoryHelper}				from "../draw/GraphicsFactoryHelper";

import {PartialImplementationError}		from "@awayjs/core/lib/errors/PartialImplementationError";
import {TriangleElements}				from "../graphics/TriangleElements";
import {MaterialBase}					from "../materials/MaterialBase";
/**
 * The Graphics class contains a set of methods that you can use to create a
 * vector shape. Display objects that support drawing include Sprite and Shape
 * objects. Each of these classes includes a <code>graphics</code> property
 * that is a Graphics object. The following are among those helper functions
 * provided for ease of use: <code>drawRect()</code>,
 * <code>drawRoundRect()</code>, <code>drawCircle()</code>, and
 * <code>drawEllipse()</code>.
 *
 * <p>You cannot create a Graphics object directly from ActionScript code. If
 * you call <code>new Graphics()</code>, an exception is thrown.</p>
 *
 * <p>The Graphics class is final; it cannot be subclassed.</p>
 */
export class GraphicsFactoryFills
{

	public static draw_pathes(targetGraphic:Graphics) {
		var len=targetGraphic.queued_fill_pathes.length;
		var cp=0;
		for(cp=0; cp<len; cp++){
			var one_path:GraphicsPath = targetGraphic.queued_fill_pathes[cp];
			//one_path.finalizeContour();
			var contour_commands:Array<Array<number> > = one_path.commands;
			var contour_data:Array<Array<number> > = one_path.data;
			var commands:Array<number>;
			var data:Array<number>;
			var i:number = 0;
			var k:number = 0;
			var vert_cnt:number = 0;
			var data_cnt:number = 0;
			var draw_direction:number = 0;
			var contours_vertices:Array<Array<number>> = [[]];
			var final_vert_list:Array<number> = [];
			var final_vert_cnt:number = 0;
			var lastPoint:Point = new Point();
			var last_dir_vec:Point=new Point();
			var end_point:Point=new Point();
			for (k = 0; k < contour_commands.length; k++) {
				contours_vertices.push([]);
				vert_cnt = 0;
				data_cnt = 0;
				commands = contour_commands[k];
				data = contour_data[k];
				draw_direction = 0;

				var new_dir:number=0;
				var new_dir_1:number=0;
				var new_dir_2:number=0;
				var dir_delta:number=0;
				var last_direction:number=0;

				var tmp_dir_point:Point=new Point();
				if((data[0] != data[data.length-2]) || (data[1] != data[data.length-1])){
					data[data.length]==data[0];
					data[data.length]==data[1];
				}

				lastPoint.x = data[0];
				lastPoint.y = data[1];
				if(commands[1]==GraphicsPathCommand.LINE_TO){
					last_dir_vec.x = data[2]-lastPoint.x;
					last_dir_vec.y = data[3]-lastPoint.y;
				}
				else if(commands[1]==GraphicsPathCommand.CURVE_TO){
					last_dir_vec.x = data[4]-lastPoint.x;
					last_dir_vec.y = data[5]-lastPoint.y;
				}
				data_cnt=2;
				last_dir_vec.normalize();
				last_direction = Math.atan2(last_dir_vec.y, last_dir_vec.x) * MathConsts.RADIANS_TO_DEGREES;
				for (i = 1; i < commands.length; i++) {
					end_point = new Point(data[data_cnt++], data[data_cnt++]);
					if (commands[i]==GraphicsPathCommand.MOVE_TO) {
						console.log("ERROR ! ONLY THE FIRST COMMAND FOR A CONTOUR IS ALLOWED TO BE A 'MOVE_TO' COMMAND");
					}
					else if (commands[i]==GraphicsPathCommand.CURVE_TO) {
						end_point = new Point(data[data_cnt++], data[data_cnt++]);

					}
					//get the directional vector and the direction for this segment
					tmp_dir_point.x = end_point.x - lastPoint.x;
					tmp_dir_point.y = end_point.y - lastPoint.y;
					tmp_dir_point.normalize();
					new_dir = Math.atan2(tmp_dir_point.y, tmp_dir_point.x) * MathConsts.RADIANS_TO_DEGREES;
					// get the difference in angle to the last segment
					dir_delta = new_dir - last_direction;
					if(dir_delta>180){
						dir_delta-=360;
					}
					if(dir_delta<-180){
						dir_delta+=360;
					}
					draw_direction += dir_delta;
					last_direction = new_dir;
					lastPoint.x = end_point.x;
					lastPoint.y = end_point.y;
				}
				lastPoint.x = data[0];
				lastPoint.y = data[1];
				data_cnt=2;
				contours_vertices[contours_vertices.length - 1][vert_cnt++] = lastPoint.x;
				contours_vertices[contours_vertices.length - 1][vert_cnt++] = lastPoint.y;
				//console.log("Draw directions complete: "+draw_direction);
				for (i = 1; i < commands.length; i++) {
					switch (commands[i]) {
						case GraphicsPathCommand.MOVE_TO:
							console.log("ERROR ! ONLY THE FIRST COMMAND FOR A CONTOUR IS ALLOWED TO BE A 'MOVE_TO' COMMAND");
							break;
						case GraphicsPathCommand.LINE_TO:
							lastPoint.x = data[data_cnt++];
							lastPoint.y = data[data_cnt++];
							contours_vertices[contours_vertices.length - 1][vert_cnt++] = lastPoint.x;
							contours_vertices[contours_vertices.length - 1][vert_cnt++] = lastPoint.y;
							break;
						case GraphicsPathCommand.CURVE_TO:
							var control_x:number = data[data_cnt++];
							var control_y:number = data[data_cnt++];
							var end_x:number = data[data_cnt++];
							var end_y:number = data[data_cnt++];

							tmp_dir_point.x = control_x - lastPoint.x;
							tmp_dir_point.y = control_y - lastPoint.y;
							tmp_dir_point.normalize();
							new_dir_1 = Math.atan2(tmp_dir_point.y, tmp_dir_point.x) * MathConsts.RADIANS_TO_DEGREES;
							tmp_dir_point.x = end_x - lastPoint.x;
							tmp_dir_point.y = end_y - lastPoint.y;
							tmp_dir_point.normalize();
							new_dir_2 = Math.atan2(tmp_dir_point.y, tmp_dir_point.x) * MathConsts.RADIANS_TO_DEGREES;
							// get the difference in angle to the last segment
							var curve_direction:number = new_dir_2 - new_dir_1;
							if(curve_direction>180){
								curve_direction-=360;
							}
							if(curve_direction<-180){
								curve_direction+=360;
							}
							if((curve_direction==0)&&(curve_direction==180)&&(curve_direction==-180)){
								lastPoint.x = end_x;
								lastPoint.y = end_y;
								contours_vertices[contours_vertices.length - 1][vert_cnt++] = lastPoint.x;
								contours_vertices[contours_vertices.length - 1][vert_cnt++] = lastPoint.y;
								break;
							}
							var curve_attr_1 = -1;
							if (draw_direction < 0) {
								if (curve_direction > 0) {
									//convex
									//console.log("convex");
									curve_attr_1 = 1;
									contours_vertices[contours_vertices.length - 1][vert_cnt++] = control_x;
									contours_vertices[contours_vertices.length - 1][vert_cnt++] = control_y;
								}
								contours_vertices[contours_vertices.length - 1][vert_cnt++] = end_x;
								contours_vertices[contours_vertices.length - 1][vert_cnt++] = end_y;
							}
							else {
								if (curve_direction < 0) {
									//convex
									//console.log("convex");
									curve_attr_1 = 1;
									contours_vertices[contours_vertices.length - 1][vert_cnt++] = control_x;
									contours_vertices[contours_vertices.length - 1][vert_cnt++] = control_y;
								}
								contours_vertices[contours_vertices.length - 1][vert_cnt++] = end_x;
								contours_vertices[contours_vertices.length - 1][vert_cnt++] = end_y;
							}

							if (GraphicsFactoryHelper.isClockWiseXY(end_x, end_y, control_x, control_y, lastPoint.x, lastPoint.y)) {
								final_vert_list[final_vert_cnt++] = end_x;
								final_vert_list[final_vert_cnt++] = end_y;
								final_vert_list[final_vert_cnt++] = curve_attr_1;
								final_vert_list[final_vert_cnt++] = 1.0;
								final_vert_list[final_vert_cnt++] = 1.0;
								final_vert_list[final_vert_cnt++] = 1.0;
								final_vert_list[final_vert_cnt++] = 0.0;
								final_vert_list[final_vert_cnt++] = control_x;
								final_vert_list[final_vert_cnt++] = control_y;
								final_vert_list[final_vert_cnt++] = curve_attr_1;
								final_vert_list[final_vert_cnt++] = 0.5;
								final_vert_list[final_vert_cnt++] = 0.0;
								final_vert_list[final_vert_cnt++] = 1.0;
								final_vert_list[final_vert_cnt++] = 0.0;
								final_vert_list[final_vert_cnt++] = lastPoint.x;
								final_vert_list[final_vert_cnt++] = lastPoint.y;
								final_vert_list[final_vert_cnt++] = curve_attr_1;
								final_vert_list[final_vert_cnt++] = 0.0;
								final_vert_list[final_vert_cnt++] = 0.0;
								final_vert_list[final_vert_cnt++] = 1.0;
								final_vert_list[final_vert_cnt++] = 0.0;
							}
							else {
								final_vert_list[final_vert_cnt++] = lastPoint.x;
								final_vert_list[final_vert_cnt++] = lastPoint.y;
								final_vert_list[final_vert_cnt++] = curve_attr_1;
								final_vert_list[final_vert_cnt++] = 1.0;
								final_vert_list[final_vert_cnt++] = 1.0;
								final_vert_list[final_vert_cnt++] = 1.0;
								final_vert_list[final_vert_cnt++] = 0.0;
								final_vert_list[final_vert_cnt++] = control_x;
								final_vert_list[final_vert_cnt++] = control_y;
								final_vert_list[final_vert_cnt++] = curve_attr_1;
								final_vert_list[final_vert_cnt++] = 0.5;
								final_vert_list[final_vert_cnt++] = 0.0;
								final_vert_list[final_vert_cnt++] = 1.0;
								final_vert_list[final_vert_cnt++] = 0.0;
								final_vert_list[final_vert_cnt++] = end_x;
								final_vert_list[final_vert_cnt++] = end_y;
								final_vert_list[final_vert_cnt++] = curve_attr_1;
								final_vert_list[final_vert_cnt++] = 0.0;
								final_vert_list[final_vert_cnt++] = 0.0;
								final_vert_list[final_vert_cnt++] = 1.0;
								final_vert_list[final_vert_cnt++] = 0.0;

							}
							lastPoint.x = end_x;
							lastPoint.y = end_y;

							break;
						case GraphicsPathCommand.CUBIC_CURVE:
							//todo
							break;
					}
				}
			}
			var verts:Array<number> = [];
			var all_verts:Array<Point> = [];
			var vertIndicess:Array<number> = [];
			var elems:Array<number> = [];
			for (k = 0; k < contours_vertices.length; k++) {
				var vertices = contours_vertices[k];

				 //for (i = 0; i < vertices.length / 2; ++i)
				 //console.log("vert collected" + i + " = " + vertices[i * 2] + " / " + vertices[i * 2 + 1]);



				var verticesF32 = new Float32Array(vertices);
				//var verticesF32 = new Float32Array([0,0, 100,0, 100,100, 0,100]);
				//console.log("in vertices", vertices);
				//var tess = new TESS();
				if (GraphicsFactoryHelper._tess_obj == null) {
					console.log("No libtess2 tesselator available.\nMake it available using Graphics._tess_obj=new TESS();");
					return;
				}
				GraphicsFactoryHelper._tess_obj.addContour(verticesF32, 2, 8, vertices.length / 2);

			}
			GraphicsFactoryHelper._tess_obj.tesselate(0/*TESS.WINDING_ODD*/, 0/*TESS.ELEMENT_POLYGONS*/, 3, 2, null);

			//console.log("out vertices", Graphics._tess_obj.getVertices());
			verts = GraphicsFactoryHelper._tess_obj.getVertices();
			elems = GraphicsFactoryHelper._tess_obj.getElements();
			//console.log("out elements", Graphics._tess_obj.getElements());


			var numVerts:number = verts.length / 2;
			var numElems:number = elems.length / 3;
			for (i = 0; i < numVerts; ++i)
				all_verts.push(new Point(verts[i * 2], verts[i * 2 + 1]));

			for (i = 0; i < numElems; ++i) {
				var p1 = elems[i * 3];
				var p2 = elems[i * 3 + 1];
				var p3 = elems[i * 3 + 2];

				final_vert_list[final_vert_cnt++] = all_verts[p3].x;
				final_vert_list[final_vert_cnt++] = all_verts[p3].y;
				final_vert_list[final_vert_cnt++] = 1;
				final_vert_list[final_vert_cnt++] = 2.0;
				final_vert_list[final_vert_cnt++] = 0.0;
				final_vert_list[final_vert_cnt++] = 1.0;
				final_vert_list[final_vert_cnt++] = 0.0;
				final_vert_list[final_vert_cnt++] = all_verts[p2].x;
				final_vert_list[final_vert_cnt++] = all_verts[p2].y;
				final_vert_list[final_vert_cnt++] = 1;
				final_vert_list[final_vert_cnt++] = 2.0;
				final_vert_list[final_vert_cnt++] = 0.0;
				final_vert_list[final_vert_cnt++] = 1.0;
				final_vert_list[final_vert_cnt++] = 0.0;
				final_vert_list[final_vert_cnt++] = all_verts[p1].x;
				final_vert_list[final_vert_cnt++] = all_verts[p1].y;
				final_vert_list[final_vert_cnt++] = 1;
				final_vert_list[final_vert_cnt++] = 2.0;
				final_vert_list[final_vert_cnt++] = 0.0;
				final_vert_list[final_vert_cnt++] = 1.0;
				final_vert_list[final_vert_cnt++] = 0.0;

			}
			//for (i = 0; i < final_vert_list.length/7; ++i)
			//	console.log("final verts "+i+" = "+final_vert_list[i*7]+" / "+final_vert_list[i*7+1]);
			var attributesView:AttributesView = new AttributesView(Float32Array, 7);
			attributesView.set(final_vert_list);
			var attributesBuffer:AttributesBuffer = attributesView.attributesBuffer;
			attributesView.dispose();
			var elements:TriangleElements = new TriangleElements(attributesBuffer);
			elements.setPositions(new Float2Attributes(attributesBuffer));
			elements.setCustomAttributes("curves", new Float3Attributes(attributesBuffer));
			elements.setUVs(new Float2Attributes(attributesBuffer));
			var material:MaterialBase = DefaultMaterialManager.getDefaultMaterial();
			material.bothSides = true;
			material.useColorTransform = true;
			material.curves = true;
			var thisGraphic:Graphic=targetGraphic.addGraphic(elements, material);
		}
		targetGraphic.queued_fill_pathes.length=0;
	}
}