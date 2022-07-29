import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { FEED_QUERY } from './LinkList';
import { AUTH_TOKEN, LINKS_PER_PAGE } from '../constants';


const CREATE_LINK_MUTATION = gql`
  mutation PostMutation(
    $description: String!
    $url: String!
  ) {
    post(description: $description, url: $url) {
      id
      url
      description
    }
  }
`;

const CreateLink = () => {
  const navigate = useNavigate()
  const [createLink] = useMutation(CREATE_LINK_MUTATION, {
    update: (cache, { data: { post } }) => {
        const take = LINKS_PER_PAGE;
        const skip = 0;
        const orderBy = {createdAt: 'desc'};
        const data = cache.readQuery({
          query: FEED_QUERY,
          variables: {
            take,
            skip,
            orderBy
          }
        });
  
        cache.writeQuery({
          query: FEED_QUERY,
          data: {
            feed: {
              links: [post, ...data.feed.links]
            }
          },
          variables: {
            take,
            skip,
            orderBy
          }
        });
      },
    onCompleted: () => navigate('/')
  });
  return (
    <div>
      <Formik
        initialValues={{ description: '', url: '' }}
        validationSchema={Yup.object({
            description: Yup.string()
              .required('Required'),
            url: Yup.string()
              .required('Required'),
          })}
        onSubmit={(values, { setSubmitting }) => {
            createLink({variables: values})
        }}
        >
        {(formik) => (
            <Form>
                <div className="flex flex-column mt3">
                  <input
                    id="description"
                    type="text"
                    {...formik.getFieldProps('description')}
                    placeholder="A description for the link"
                  />
                  <input
                    id="url"
                    {...formik.getFieldProps('url')}
                    type="text"
                    placeholder="The URL for the link"
                  />
                </div>
                <button type="submit">Submit</button>
              </Form>
            )}
        </Formik>
    </div>
  );
};

export default CreateLink;


