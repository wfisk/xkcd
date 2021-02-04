import Bone from './Bone';
import Controller from './Controller';
import Drawable from './Drawable';
import Entity from './Entity';
import Gizmo from './Gizmo';
import Model from './Model';
import Overlay from './Overlay';
import Parser from './Parser';
import Renderer from './Renderer';
import Scene from './Scene';
import Skelet from './Skelet';
import View from './View';
import XKCD from './XKCD';

import Actor from './entities/Actor';
import Bubble from './entities/Bubble';
import Drawing from './entities/Drawing';
import Label from './entities/Label';

import EntityGizmo from './gizmos/EntityGizmo';
import ActorGizmo from './gizmos/ActorGizmo';
import BubbleGizmo from './gizmos/BubbleGizmo';
import DrawingGizmo from './gizmos/DrawingGizmo';
import LabelGizmo from './gizmos/LabelGizmo';

import SceneModel from './models/SceneModel';
import ActorModel from './models/ActorModel';
import BubbleModel from './models/BubbleModel';
import DrawingModel from './models/DrawingModel';
import LabelModel from './models/LabelModel';

// build CMX instance...
const cmx = new Controller();
cmx['Model'] = Model;
cmx['View'] = View;
cmx['Drawable'] = Drawable;
cmx['XKCD'] = XKCD;
cmx['Bone'] = Bone;
cmx['Skelet'] = Skelet;
cmx['Scene'] = Scene;
cmx['Entity'] = Entity;
cmx['Gizmo'] = Gizmo;
cmx['Renderer'] = Renderer;
cmx['Overlay'] = Overlay;
cmx['Parser'] = Parser;
cmx['Actor'] = Actor;
cmx['Bubble'] = Bubble;
cmx['Drawing'] = Drawing;
cmx['Label'] = Label;
cmx['EntityGizmo'] = EntityGizmo;
cmx['ActorGizmo'] = ActorGizmo;
cmx['BubbleGizmo'] = BubbleGizmo;
cmx['DrawingGizmo'] = DrawingGizmo;
cmx['LabelGizmo'] = LabelGizmo;
cmx['SceneModel'] = SceneModel;
cmx['ActorModel'] = ActorModel;
cmx['BubbleModel'] = BubbleModel;
cmx['DrawingModel'] = DrawingModel;
cmx['LabelModel'] = LabelModel;

export default cmx;
