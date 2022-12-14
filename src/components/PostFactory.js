import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { storageService, dbService } from "firebase_im";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const PostFactory = ({ userObj }) => {
  const [attachment, setAttachment] = useState("");
  const [post, setPost] = useState("");
  const fileInput = useRef();
  const onSubmit = async (event) => {
    if (post === "") {
      return;
    }
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(attachmentRef, attachment, "data_url");
      attachmentUrl = await getDownloadURL(response.ref);
    }
    const postObj = {
      text: post,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    const docRef = await addDoc(collection(dbService, "post-with"), postObj);
    setPost("");
    setAttachment("");
    if (attachment !== "") {
      fileInput.current.value = null;
    }
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setPost(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onClearAttachment = () => {
    fileInput.current.value = null;
    setAttachment("");
  };

  return (
    <form onSubmit={onSubmit} className='factoryForm'>
      <div className='factoryInput__container'>
        <input
          className='factoryInput__input'
          value={post}
          onChange={onChange}
          type='text'
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type='submit' value='&rarr;' className='factoryInput__arrow' />
      </div>
      <label htmlFor='attach-file' className='factoryInput__label'>
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id='attach-file'
        type='file'
        accept='image/*'
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />

      {attachment && (
        <div className='factoryForm__attachment'>
          <img
            src={attachment}
            style={{
              backgroundImage: attachment,
            }}
          />
          <div className='factoryForm__clear' onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default PostFactory;
