import { useMutation, gql } from '@apollo/client';
import { Button, Form } from 'semantic-ui-react';
import { useForm } from '../utils/hooks';
import { FETCH_POSTS_QUERY } from '../utils/graphql';

function PostForm() {
   const { values, onChange, onSubmit } = useForm(createPostCallback, {
      title: ''
   });

   const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
      update(proxy, result) {
         const data = proxy.readQuery({
            query: FETCH_POSTS_QUERY
         });
         const newPosts = [result.data.createPost, ...data.posts];
         proxy.writeQuery({
            query: FETCH_POSTS_QUERY,
            data: { ...data, posts: newPosts }
         });
         values.title = '';
      },
      variables: values
   });

   function createPostCallback() {
      createPost();
   }
   if (error) {
      console.log(error);
   }
   return (
      <>
         <Form onSubmit={onSubmit}>
            <h2> Create a post:</h2>
            <Form.Field>
               <Form.Input
                  placeholder="Hi, World!"
                  name="title"
                  onChange={onChange}
                  value={values.title}
                  error={error ? true : false}
               />
               <Button type="submit" color="teal">
                  Submit
               </Button>
            </Form.Field>
         </Form>
         {error && (
            <div className="ui error message">
               <ul className="list">
                  <li>{error.graphQLErrors[0].message}</li>
               </ul>
            </div>
         )}
      </>
   );
}

const CREATE_POST_MUTATION = gql`
   mutation createPost($title: String!) {
      createPost(title: $title) {
         id
         title
         user {
            id
            username
         }
      }
   }
`;

export default PostForm;
