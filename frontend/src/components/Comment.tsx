import {useState} from "react";

const Comment = ({ text, onDelete, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(text);

    const handleSave = () => {
        if (editedText.trim() !== "") {
            onEdit(editedText.trim());
            setIsEditing(false);
        }
    };

    return (
        <div className="bg-gray-100 p-3 rounded-lg shadow-sm flex flex-col items-start justify-between gap-1">
            {isEditing ? (
                <input
                    type="text"
                    className="flex-1 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                />
            ) : (
                <p className="flex-1 text-sm break-words">{text}</p>
            )}
            <div className="flex gap-2 justify-end w-full">
                {isEditing ? (
                    <button
                        onClick={handleSave}
                        className="
                        Save
                    </button>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-blue-500 hover:underline text-sm"
                    >
                        Edit
                    </button>
                )}
                
            </div>
        </div>
    );
};

export default Comment;