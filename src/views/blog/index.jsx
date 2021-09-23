import React, { Component } from "react";
import { Container, Image, Row, Col } from "react-bootstrap";
import { withRouter } from "react-router";
import BlogAuthor from "../../components/blog/blog-author";
import "./styles.css";
class Blog extends Component {
  state = {
    blog: {},
    loading: true,
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
        console.log(data);
        this.setState({ ...this.state, blog: data });
        this.setState({ ...this.state, loading: false });
      } else {
        console.log("Some error");
      }
    } catch (err) {
      console.log(err);
    }
  };
  render() {
    const { loading, blog } = this.state;
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
                <a
                  className="btn btn-primary"
                  href={`${process.env.REACT_APP_URLTOFETCH}/blogPosts/${this.props.match.params.id}/savePDF`}
                >
                  Download as PDF
                </a>
              </Col>
              <Col xs={12} md={3}>
                <div className="d-flex flex-column align-middle text-center">
                  <h2>Commentaries</h2>
                  <hr />
                  {blog[0].comments ? (
                    blog[0].comments.map((com) => (
                      <div className="comment">
                        <h5>{com.comment}</h5>
                        <h6 className="text-muted">Author: {com.author}</h6>
                        <small className="text-muted">id: {com._id}</small>
                      </div>
                    ))
                  ) : (
                    <h4> No comments! </h4>
                  )}
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
