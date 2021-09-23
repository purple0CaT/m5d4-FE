import React, { Component } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Container, Form, Button } from "react-bootstrap";
import "./styles.css";
import { useState, useEffect } from "react";

const NewBlogPost = () => {
  const [Post, setPost] = useState({
    body: {
      category: "123",
      title: "123",
      cover: "",
      readTime: { value: 1, unit: "minutes" },
      author: {
        name: "Ian",
        _id: "123kjwabn123sj",
        avatar: "https://source.unsplash.com/random?1",
      },
      content: "This is created on frontEnd and saved in backend",
    },
  });
  const [Authors, setAuthors] = useState({ data: [] });
  const [Cover, setCover] = useState();
  const [Avatar, setAvatar] = useState();

  useEffect(() => {
    fetchAuthors();
  }, []);

  // All authors
  const fetchAuthors = async () => {
    const url = `${process.env.REACT_APP_URLTOFETCH}/authors/`;
    try {
      let response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let data = await response.json();
      if (response.ok) {
        setAuthors({ data: data });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const sendPost = async (e) => {
    e.preventDefault();
    const url = `${process.env.REACT_APP_URLTOFETCH}/blogPosts/`;
    // console.log(Post);
    // SENDING;
    try {
      let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(Post.body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        let data = await response.json();
        !data[0].author && sendAuthorAvatar(data[0].authorId);
        sendCover(data[0]._id);
      } else {
        console.log("ERROR!");
      }
    } catch (err) {
      console.log(err);
    }
  };
  // Send Cover!
  const sendCover = async (id) => {
    const url = `${process.env.REACT_APP_URLTOFETCH}/blogPosts/${id}/uploadCover/`;
    const formData = new FormData();
    formData.append("coverPic", Cover);
    try {
      let response = await fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          "Context-Type": "multipart/form-data",
        },
      });
      if (response.ok) {
        console.log("Sended!");
      } else {
        console.log(formData);
      }
    } catch (err) {
      console.log(err);
    }
  };
  // Send Author avatar
  const sendAuthorAvatar = async (id) => {
    const url = `${process.env.REACT_APP_URLTOFETCH}/authors/${id}/uploadAvatar/`;
    const formData = new FormData();
    formData.append("avatar", Cover.avatar);
    try {
      let response = await fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          "Context-Type": "multipart/form-data",
        },
      });
      if (response.ok) {
        console.log("Sended!");
      } else {
        console.log(formData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container className="new-blog-container">
      <Form className="mt-5" onSubmit={sendPost}>
        <Form.Group controlId="blog-cover" className="mt-3">
          <p className=" my-2 font-weight-light" style={{ fontSize: "2rem" }}>
            New post!
          </p>
          <Form.Label>Cover image</Form.Label>
          {/* <Form.Control
            size="lg"
            placeholder="Title"
            value={Post.cover}
            onChange={(e) =>
              this.setState({ ...this.state, cover: e.target.value })
            }
          />
        </Form.Group>
        <p className=" my-2 font-weight-light" style={{ fontSize: "1.5rem" }}>
          or upload
        </p>
        <Form.Group> */}
          <Form.File
            id="blog-img"
            className="my-4"
            label=""
            // value={this.state.coverFile}
            onChange={(e) => setCover(e.target.files[0])}
          />
        </Form.Group>
        <hr />
        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            size="lg"
            placeholder="Title"
            value={Post.body.title}
            onChange={(e) =>
              setPost({ body: { ...Post.body, title: e.target.value } })
            }
          />
        </Form.Group>
        <Form.Group controlId="blog-category" className="mt-3">
          <Form.Label>Category</Form.Label>
          <Form.Control
            size="lg"
            as="select"
            onChange={(e) =>
              setPost({ body: { ...Post.body, category: e.target.value } })
            }
          >
            <option>Some category</option>
            <option>Else one</option>
            <option>Or this one</option>
            <option>guse</option>
            <option>doggo</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="blog-content" className="mt-3">
          <Form.Label>Blog Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            // onChange={this.handleChange}
            // className="new-blog-content"
            value={Post.body.content}
            onChange={(e) =>
              setPost({ body: { ...Post.body, content: e.target.value } })
            }
          />
        </Form.Group>
        <hr />
        <p className=" my-2 font-weight-light" style={{ fontSize: "2.5rem" }}>
          Author details
        </p>
        <Form.Group controlId="blog-authorsLib" className="mt-3">
          <Form.Label>Existing authors</Form.Label>
          <Form.Control
            size="lg"
            as="select"
            onChange={(e) =>
              // console.log(e.target.value)
              setPost({
                body: {
                  ...Post.body,
                  author: Authors.data.filter(
                    (auth) => auth._id == e.target.value
                  )[0],
                },
              })
            }
          >
            {Authors &&
              Authors.data.map((authr) => (
                <option key={authr._id + authr.name} value={authr._id}>
                  {authr.name}
                </option>
              ))}
          </Form.Control>
        </Form.Group>
        <br />
        <img
          src={Post.body.author.avatar}
          style={{
            width: "10rem",
            height: "10rem",
            objectFit: "cover",
            borderRadius: "50%",
          }}
          alt=""
        />
        <hr />
        <p className=" my-2 font-weight-light" style={{ fontSize: "1.5rem" }}>
          Or create new one!
        </p>
        <Form.Group controlId="blog-author" className="mt-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            size="lg"
            placeholder="Author name"
            value={Post.body.author.name}
            onChange={(e) =>
              setPost({
                body: {
                  ...Post.body,
                  author: {
                    ...Post.body.author,
                    name: e.target.value,
                    _id: "",
                  },
                },
              })
            }
          />
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label>Avatar</Form.Label>
          {/* <Form.Control
            size="lg"
            placeholder="Avatar"
            value={Post.author.avatar}
            onChange={(e) =>
              setPost({
                ...Post,
                author: { ...Post.avatar, avatar: e.target.value },
              })
            }
          />
        </Form.Group> */}
          {/* <Form.Group> */}
          <Form.File
            id="blog-img"
            onChange={(e) => setAvatar(e.target.files[0])}
          />
        </Form.Group>
        <Form.Group className="d-flex mt-3 justify-content-end">
          <Button type="reset" size="lg" variant="outline-dark">
            Reset
          </Button>
          <Button
            type="submit"
            size="lg"
            variant="dark"
            style={{ marginLeft: "1em" }}
          >
            Submit
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};
export default NewBlogPost;
