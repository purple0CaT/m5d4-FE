import React, { Component } from "react";
import { Container, Image, Row, Col, Form } from "react-bootstrap";
import { withRouter } from "react-router";
import BlogAuthor from "../../components/blog/blog-author";
import "./styles.css";
class Blog extends Component {
  state = {
    blog: {},
    loading: true,
    email: "",
    newComment: { comment: "", author: "" },
  };
  componentDidMount = () => {
    this.fetchDatas();
  };
  fetchDatas = async () => {
    const url =
      `${process.env.REACT_APP_URLTOFETCH}/blogPosts/` +
      this.props.match.params.id;
    try {
      let response = await fetch(url);
      let data = await response.json();
      if (response.ok) {
        this.setState({ ...this.state, blog: data });
        this.setState({ ...this.state, loading: false });
      } else {
        console.log("Some error");
      }
    } catch (err) {
      console.log(err);
    }
  };
  sendComment = async (e) => {
    e.preventDefault();
    const url = `${process.env.REACT_APP_URLTOFETCH}/blogPosts/${this.props.match.params.id}/comments`;
    try {
      let res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(this.state.newComment),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        alert("Success!");
        this.fetchDatas();
      } else {
        alert("Error!");
      }
    } catch (err) {
      console.log(err);
    }
  };
  sendPdfByEmail = async (e) => {
    e.preventDefault();
    const url = `${process.env.REACT_APP_URLTOFETCH}/pdfs/${this.props.match.params.id}/sendPdfEmail`;
    try {
      let res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ email: this.state.email }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        alert("Success!");
      } else {
        alert("Error!");
      }
    } catch (err) {
      console.log(err);
    }
  };
  render() {
    const { loading, blog, newComment, email } = this.state;
    if (loading) {
      return <div>loading</div>;
    } else {
      return (
        <div className="blog-details-root">
          <Container>
            <Row>
              <Col xs={12} md={9}>
                <Image
                  className="blog-details-cover"
                  src={blog[0].cover}
                  fluid
                />
                <h1 className="blog-details-title">{blog[0].title}</h1>

                <div className="blog-details-container">
                  <div className="blog-details-author">
                    <BlogAuthor {...blog[0].author} />
                  </div>
                  <div className="blog-details-info">
                    <div>{blog[0].createdAt}</div>
                    <div>{`${blog[0].readTime.value} ${blog[0].readTime.unit} read`}</div>
                  </div>
                </div>

                <div
                  dangerouslySetInnerHTML={{ __html: blog[0].content }}
                ></div>
                <hr />
                <div className="d-flex flex-column">
                  <div>
                    <a
                      className="btn btn-primary"
                      href={`${process.env.REACT_APP_URLTOFETCH}/pdfs/${this.props.match.params.id}/savePDF`}
                    >
                      Download as PDF
                    </a>
                    <a
                      className="btn btn-light mx-3"
                      href={`${process.env.REACT_APP_URLTOFETCH}/pdfs/saveCSV`}
                    >
                      Download Authors (CSV)
                    </a>
                  </div>
                  <br />
                  <div className="d-flex">
                    <Form onSubmit={this.sendPdfByEmail}>
                      <Form.Group>
                        <Form.Label>Or send PDF on your E-mail</Form.Label>
                        <Form.Control
                          required
                          value={email}
                          type="email"
                          placeholder="... email"
                          onChange={(e) =>
                            this.setState({
                              ...this.state,
                              email: e.target.value,
                            })
                          }
                        />
                      </Form.Group>
                      <button type="submit" className="btn btn-info mt-1">
                        Send PDF
                      </button>
                    </Form>
                  </div>
                </div>
              </Col>
              {/* COMMENTS AREA */}
              <Col xs={12} md={3}>
                <div className="d-flex flex-column align-middle text-center">
                  <h2>Commentaries</h2>
                  <hr />
                  {blog[0].comments &&
                    blog[0].comments.map((com) => (
                      <div className="comment" key={com._id + com.author}>
                        <h5>{com.comment}</h5>
                        <h6 className="text-muted">Author: {com.author}</h6>
                        <small className="text-muted">id: {com._id}</small>
                      </div>
                    ))}

                  <hr />
                  <h5>Add comment</h5>
                  <Form onSubmit={this.sendComment}>
                    <Form.Group>
                      <Form.Label>Comment</Form.Label>
                      <Form.Control
                        required
                        value={newComment.comment}
                        type="comment"
                        placeholder="... comment"
                        onChange={(e) =>
                          this.setState({
                            ...this.state,
                            newComment: {
                              ...this.state.newComment,
                              comment: e.target.value,
                            },
                          })
                        }
                      />
                    </Form.Group>
                    <Form.Group className="mt-1">
                      <Form.Label>Author</Form.Label>
                      <Form.Control
                        required
                        value={newComment.author}
                        type="author"
                        placeholder="... author"
                        onChange={(e) =>
                          this.setState({
                            ...this.state,
                            newComment: {
                              ...this.state.newComment,
                              author: e.target.value,
                            },
                          })
                        }
                      />
                    </Form.Group>
                    <button type="submit" className="btn btn-light mt-2">
                      Send comment
                    </button>
                  </Form>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      );
    }
  }
}

export default withRouter(Blog);
