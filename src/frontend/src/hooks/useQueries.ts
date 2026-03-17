import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Post, PostInput } from "../backend.d";
import { Category } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPost(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Post | null>({
    queryKey: ["post", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getPost(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useGetPostsByCategory(category: Category | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Post[]>({
    queryKey: ["posts", "category", category],
    queryFn: async () => {
      if (!actor || !category) return [];
      return actor.getPostsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: PostInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.createPost(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useUpdatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: bigint; input: PostInput }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updatePost(id, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useDeletePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deletePost(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export { Category };
