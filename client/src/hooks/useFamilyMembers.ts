import { useQuery } from "@tanstack/react-query";
import { Record } from "@/lib/types";

interface FamilyMembersResponse {
  familyId: string;
  database: string;
  members: Record[];
}

interface UseFamilyMembersProps {
  familyId: string;
  database: string;
  enabled?: boolean;
}

export function useFamilyMembers({ familyId, database, enabled = true }: UseFamilyMembersProps) {
  return useQuery<Record[]>({
    queryKey: ['/api/family-members', familyId, database],
    queryFn: async () => {
      const response = await fetch(`/api/family-members/${familyId}/${database}`);
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to fetch family members');
      }
      const data = await response.json() as FamilyMembersResponse;
      return data.members;
    },
    enabled: Boolean(familyId && database && enabled),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}