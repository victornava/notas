/**
 * @author vic
 */
//req = {'funk':'get_notes', 'state':'active'};
//req = {'funk':'get_notes', 'state':'trashed'};
//req = {'funk':'delete_notes', 'notesIds': notesIds};
//note.id = 270;

nota = Nota();
notas = [note];
req = {'funk':'save_notes', 'notas': notas};

ajaxEnPolvo(req);