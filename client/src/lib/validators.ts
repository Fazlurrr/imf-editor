import { ValidUploadEdge, ValidUploadNode } from './types';

export const validateJsonFiles = async (
  files: File[]
): Promise<string | null> => {
  for (const file of files) {
    if (file.name !== 'nodes.json' && file.name !== 'edges.json') {
      return 'Files must be named nodes.json and edges.json';
    }
    if (file.type !== 'application/json') {
      try {
        const text = await file.text();
        JSON.parse(text);
      } catch (error) {
        return 'One or more files are not valid JSON';
      }
    }
    if (file.name === 'nodes.json') {
      const text = await file.text();
      try {
        const nodes = JSON.parse(text);
        validateNodesJson(nodes);
      } catch (error) {
        return `Invalid nodes.json file ${(error as Error).message}`;
      }
    }
    if (file.name === 'edges.json') {
      const text = await file.text();
      try {
        const edges = JSON.parse(text);
        validateEdgesJson(edges);
      } catch (error) {
        return `Invalid edges.json file ${(error as Error).message}`;
      }
    }
  }
  return null;
};

export const validateNodesJson = (nodes: ValidUploadNode[]) => {
  for (const node of nodes) {
    if (node.type === 'block') {
      if (!node.data.parent) {
        throw new Error(`Block ${node.id} must have a parent`);
      }
      if (!node.data.children) {
        throw new Error(`Block ${node.id} must have children`);
      }
      if (!node.data.terminals) {
        throw new Error(`Block ${node.id} must have terminals`);
      }
      if (!node.data.fulfilledBy) {
        throw new Error(`Block ${node.id} must be fulfilled by`);
      }
      if (!node.data.fulfills) {
        throw new Error(`Block ${node.id} must fulfill`);
      }
      if (!node.data.directParts) {
        throw new Error(`Block ${node.id} must have direct parts`);
      }
      if (!node.data.connectedTo) {
        throw new Error(`Block ${node.id} must be connected to`);
      }
      if (!node.data.connectedBy) {
        throw new Error(`Block ${node.id} must be connected by`);
      }
      if (node.data.directPartOf == null) {
        throw new Error(`Block ${node.id} must be a direct part of`);
      }
      if (!node.height) {
        node.width = 48;
      }
      if (!node.width) {
        node.width = 96;
      }
      if (!node.position.x) {
        throw new Error(`Block ${node.id} must have an x position`);
      }
      if (!node.position.y) {
        throw new Error(`Block ${node.id} must have a y position`);
      }
      if (!node.nodeId) {
        throw new Error(`Block ${node.id} must have a nodeId`);
      }
      if (!node.id) {
        throw new Error(`Block ${node.id} must have an id`);
      }
    }
    if (node.type === 'connector') {
      if (!node.data.connectedTo) {
        throw new Error(`Connector ${node.id} must be connected to`);
      }
      if (!node.data.connectedBy) {
        throw new Error(`Connector ${node.id} must be connected by`);
      }
      if (!node.height) {
        node.height = 32;
      }
      if (!node.width) {
        node.width = 32;
      }
      if (!node.position.x) {
        throw new Error(`Connector ${node.id} must have an x position`);
      }
      if (!node.position.y) {
        throw new Error(`Connector ${node.id} must have a y position`);
      }
      if (!node.nodeId) {
        throw new Error(`Connector ${node.id} must have a nodeId`);
      }
      if (!node.id) {
        throw new Error(`Connector ${node.id} must have an id`);
      }
    }
    if (node.type === 'terminal') {
      if (node.data.terminalOf == null) {
        throw new Error(`Terminal ${node.id} must be a terminal of`);
      }
      if (!node.data.connectedTo) {
        throw new Error(`Terminal ${node.id} must be connected to`);
      }
      if (!node.data.connectedBy) {
        throw new Error(`Terminal ${node.id} must be connected by`);
      }
      if (node.data.transfersTo == null) {
        throw new Error(`Terminal ${node.id} must transfer to`);
      }
      if (node.data.transferedBy == null) {
        throw new Error(`Terminal ${node.id} must transfer by`);
      }
      if (!node.height) {
        node.height = 26;
      }
      if (!node.width) {
        node.width = 24;
      }
      if (!node.position.x) {
        throw new Error(`Terminal ${node.id} must have an x position`);
      }
      if (!node.position.y) {
        throw new Error(`Terminal ${node.id} must have a y position`);
      }
      if (!node.nodeId) {
        throw new Error(`Terminal ${node.id} must have a nodeId`);
      }
      if (!node.id) {
        throw new Error(`Terminal ${node.id} must have an id`);
      }
    }
  }
};

export const validateEdgesJson = (edges: ValidUploadEdge[]) => {
  for (const edge of edges) {
    if (!edge.source) {
      throw new Error(`Èdge ${edge.edgeId} must have a source`);
    }
    if (!edge.target) {
      throw new Error(`Èdge ${edge.edgeId} must have a target`);
    }
    if (!edge.id) {
      throw new Error(`Èdge ${edge.edgeId} must have an id`);
    }
    if (!edge.edgeId) {
      throw new Error(`Èdge ${edge.edgeId} must have an edgeId`);
    }
    if (!edge.type) {
      throw new Error(`Èdge ${edge.edgeId} must have a type`);
    }
    if (!edge.sourceHandle) {
      throw new Error(`Èdge ${edge.edgeId} must have a sourceHandle`);
    }
    if (!edge.targetHandle) {
      throw new Error(`Èdge ${edge.edgeId} must have a targetHandle`);
    }
    if (!edge.data) {
      throw new Error(`Èdge ${edge.edgeId} must have data`);
    }
    if (!edge.data.createdAt) {
      throw new Error(`Èdge ${edge.edgeId} must have a createdAt`);
    }
    if (!edge.data.updatedAt) {
      throw new Error(`Èdge ${edge.edgeId} must have an updatedAt`);
    }
    if (!edge.data.createdBy) {
      throw new Error(`Èdge ${edge.edgeId} must have a createdBy`);
    }
    if (!edge.data.label) {
      throw new Error(`Èdge ${edge.edgeId} must have a label`);
    }
    if (edge.data.lockConnection == null) {
      throw new Error(`Èdge ${edge.edgeId} must have a lockConnection`);
    }
  }
};
