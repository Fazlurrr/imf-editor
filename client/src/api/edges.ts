import { useLoading, useSession, useStore } from '@/hooks';
import { EdgeType, EdgeWithEdgeId } from '@/lib/types';
import { updateNodeRelations } from '@/lib/utils';
import toast from 'react-hot-toast';
import { type Edge, type Node } from 'reactflow';

export const fetchEdges = async (): Promise<Edge[] | null> => {
  const { logout, user, token } = useSession.getState();

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/edges/${user?.id}/all`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.status === 401) {
    logout();
    toast.error('Unauthorized');
    return null;
  }

  if (!response.ok) {
    const status = response.status;
    toast.error(`Error fetching edges - Status: ${status}`);
    return null;
  }

  const edges = await response.json();

  return edges;
};

export const createEdge = async (edge: Edge): Promise<Edge | null> => {
  const { startLoading, stopLoading } = useLoading.getState();
  const { edges, setEdges } = useStore.getState();
  const { token, logout } = useSession.getState();

  startLoading();

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/edges`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(edge),
    });

    if (response.status === 401) {
      logout();
      toast.error('Unauthorized');
      return null;
    }

    if (!response.ok) {
      const status = response.status;
      toast.error(`Error creating edge - Status: ${status}`);
      return null;
    }

    const createdEdge = await response.json();

    toast.success('Edge created successfully!');

    if (createdEdge) {
      createdEdge.id = createdEdge.id.toString();
      const newEdges = edges.concat(createdEdge as Edge);
      setEdges(newEdges);
    }

    return createdEdge as Edge;
  } catch (error) {
    toast.error(`Error creating edge: ${(error as Error).message}`);
    throw error;
  } finally {
    stopLoading();
  }
};

export const uploadEdges = async (edgesToAdd: Edge[]): Promise<boolean> => {
  const { setEdges } = useStore.getState();
  const { token, logout } = useSession.getState();
  const { startLoading, stopLoading } = useLoading.getState();

  startLoading();

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/edges/upload`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(edgesToAdd),
      }
    );

    if (response.status === 401) {
      logout();
      toast.error('Unauthorized');
      return false;
    }

    if (!response.ok) {
      const status = response.status;
      toast.error(`Error uploading edges - Status: ${status}`);
      return false;
    }

    toast.success('Edges uploaded successfully!');

    return true;
  } catch (error) {
    toast.error(`Error uploading edges: ${(error as Error).message}`);
    throw error;
  } finally {
    stopLoading();
    const edges = await fetchEdges();
    if (edges) {
      setEdges(edges);
    }
  }
};
export const deleteEdge = async (
  edgeIdToDelete: string,
  edges: Edge[],
  setEdges: (edges: Edge[]) => void,
  nodes: Node[],
  setNodes: (nodes: Node[]) => void,
  nodeToDeleteId?: string
): Promise<string | null> => {
  const edgeToDelete = edges.find(
    edge => edge.id === edgeIdToDelete
  ) as EdgeWithEdgeId;

  if (!edgeToDelete.id) {
    toast.error(`Error deleting edge - ${edgeIdToDelete} not found`);
    return null;
  }

  const { token, logout } = useSession.getState();
  const { startLoading, stopLoading } = useLoading.getState();

  startLoading();
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/edges/${edgeToDelete.id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 401) {
      logout();
      toast.error('Unauthorized');
      return null;
    }

    if (!response.ok) {
      const status = response.status;
      toast.error(`Error deleting edge - Status: ${status}`);
      return null;
    }

    toast.success('Edge deleted successfully!');

    const edges = await fetchEdges();

    if (edges) {
      setEdges(edges);
    }

    return edgeIdToDelete;
  } catch (error) {
    toast.error(`Error deleting edge: ${(error as Error).message}`);
    throw error;
  } finally {
    stopLoading();
    updateNodeRelations(edgeToDelete, nodes, setNodes, nodeToDeleteId);
  }
};

export const updateEdge = async (
  edgeToUpdateId: string,
  edges: Edge[],
  setEdges: (edges: Edge[]) => void,
  newConnection: EdgeType
): Promise<Edge | null> => {
  const edgeToUpdate = edges.find(edge => edge.id === edgeToUpdateId);

  if (!edgeToUpdate) {
    toast.error(`Error updating edge - ${edgeToUpdateId} not found`);
    return null;
  }

  const { token, logout } = useSession.getState();
  const { startLoading, stopLoading } = useLoading.getState();

  startLoading();

  edgeToUpdate.type = newConnection;
  edgeToUpdate.data.updatedAt = Date.now();

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/edges`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(edgeToUpdate),
    });

    if (response.status === 401) {
      logout();
      toast.error('Unauthorized');
      return null;
    }

    if (!response.ok) {
      const status = response.status;
      toast.error(`Error updating edge - Status: ${status}`);
      return null;
    }

    toast.success('Edge updated successfully!');

    const updatedEdge = await response.json();

    if (updatedEdge) {
      const newEdges = edges.map(edge => {
        if (edge.id === updatedEdge.id) {
          return updatedEdge;
        }
        return edge;
      });

      setEdges(newEdges);
    }

    return updatedEdge as Edge;
  } catch (error) {
    toast.error(`Error updating edge: ${(error as Error).message}`);
    throw error;
  } finally {
    stopLoading();
  }
};

export const deleteEdges = async (): Promise<boolean> => {
  const { setEdges } = useStore.getState();
  const { token, user, logout } = useSession.getState();
  const { startLoading, stopLoading } = useLoading.getState();

  startLoading();

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/edges/${user?.id}/all`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 401) {
      logout();
      toast.error('Unauthorized');
      return false;
    }

    if (!response.ok) {
      const status = response.status;
      toast.error(`Error deleting edges - Status: ${status}`);
      return false;
    }

    setEdges([]);
    return true;
  } catch (error) {
    toast.error(`Error deleting edges: ${(error as Error).message}`);
    throw error;
  } finally {
    stopLoading();
  }
};
