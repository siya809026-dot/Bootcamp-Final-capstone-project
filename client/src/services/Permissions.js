// Teachers can modify any note. Students can only modify their own.
export function canModifyNote(note, currentUser) {
  if (!currentUser) return false;
  if (currentUser.role === "Teacher") return true;
  const ownerId = note.uploadedBy?._id || note.uploadedBy;
  return ownerId === currentUser._id;
}