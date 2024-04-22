import type { Edge, EdgeProps, Node, NodeProps } from 'reactflow';

export enum AppPage {
  Home = 'home',
  Login = 'login',
  Dashboard = 'dashboard',
}

export enum AspectType {
  Function = 'function',
  Product = 'product',
  Location = 'location',
  Empty = 'empty',
}

export enum NodeType {
  Block = 'block',
  Connector = 'connector',
  Terminal = 'terminal',
}

export enum EdgeType {
  Connected = 'connected',
  Fulfilled = 'fulfilled',
  Part = 'part',
  Transfer = 'transfer',
}

export enum RelationType {
  ConnectedTo = 'connectedTo',
  ConnectedBy = 'connectedBy',
  DirectParts = 'directParts',
  FulfilledBy = 'fulfilledBy',
  Terminals = 'terminals',
  TerminalOf = 'terminalOf',
  DirectPartOf = 'directPartOf',
  TransfersTo = 'transfersTo',
  TransferedBy = 'transferedBy',
  Fulfills = 'fulfills',
}

export type Role = 'admin' | 'user';

export type UpdateNode = {
  customName?: string;
  aspect?: AspectType;
  customAttributes?: CustomAttribute[];
};

export type Relation = {
  id: string;
};

export type CustomAttribute = {
  name: string;
  value: string;
};

export type NodeData = {
  aspect: AspectType;
  parent: 'void' | string;
  children?: Relation[];
  terminals?: Relation[];
  terminalOf?: string;
  transfersTo?: string;
  transferedBy?: string;
  connectedTo?: Relation[];
  connectedBy?: Relation[];
  directParts?: Relation[];
  customAttributes: CustomAttribute[];
  directPartOf?: string;
  fulfills?: Relation[];
  fulfilledBy?: Relation[];
  label: string;
  createdAt: number;
  updatedAt: number;
  customName?: string;
  createdBy: string;
};

export type EdgeData = {
  id: string;
  label: string;
  lockConnection: boolean;
  createdAt: number;
  updatedAt: number;
  customName?: string;
  createdBy: string;
};

export type CustomEdgeProps = Omit<EdgeProps, 'data'> &
  EdgeData & {
    data: EdgeData;
    type: string;
  };

export type CustomNodeProps = Omit<NodeProps, 'data'> &
  NodeData & {
    data: NodeData;
  };

export type NodeRelation = {
  nodeId: string;
  relation?: {
    [key: string]: string;
  };
  relations?: {
    [key: string]: {
      id: string;
    };
  };
};

export type NavItem = {
  title: string;
  subtitle: string;
  children: {
    title: string;
    description: string;
    nodeType: NodeType;
  }[];
};

export type RelationKeys =
  | 'connectedTo'
  | 'directParts'
  | 'fulfilledBy'
  | 'terminals'
  | 'terminalOf'
  | 'directPartOf'
  | 'transfersTo'
  | 'transferedBy'
  | 'fulfills'
  | 'connectedBy';

export type RelationKeysWithChildren = {
  key: RelationKeys;
  children: { id: string }[];
};

export type NodeWithNodeId = Node & {
  nodeId: string;
};

export type EdgeWithEdgeId = Edge & {
  edgeId: string;
};

export type User = {
  id: string;
  username: string;
  role: Role;
};

export type UserWithToken = {
  user: User;
  token: string;
};

type CommonData = {
  createdAt: number;
  updatedAt: number;
  createdBy: string;
  customName: string;
  customAttributes: CustomAttribute[];
  aspect: string;
  label: string;
};

type NodePosition = {
  x: number;
  y: number;
};

type BlockData = CommonData & {
  parent: string;
  children: string[];
  terminals: string[];
  fulfilledBy: string[];
  fulfills: string[];
  directParts: string[];
  connectedTo: string[];
  connectedBy: string[];
  directPartOf: string;
};

type Block = {
  data: BlockData;
  nodeId: string;
  id: string;
  position: NodePosition;
  type: 'block';
  width: number;
  height: number;
};

type ConnectorData = CommonData & {
  connectedTo: string[];
  connectedBy: string[];
};

type Connector = {
  data: ConnectorData;
  nodeId: string;
  id: string;
  position: NodePosition;
  type: 'connector';
  width: number;
  height: number;
};

type TerminalData = CommonData & {
  terminalOf: string;
  connectedTo: string[];
  connectedBy: string[];
  transfersTo: string;
  transferedBy: string;
};

type Terminal = {
  data: TerminalData;
  nodeId: string;
  id: string;
  position: NodePosition;
  type: 'terminal';
  width: number;
  height: number;
};

export type ValidUploadNode = Block | Terminal | Connector;

export type ValidUploadEdge = {
  edgeId: string;
  id: string;
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
  type: EdgeType;
  data: EdgeData;
};
