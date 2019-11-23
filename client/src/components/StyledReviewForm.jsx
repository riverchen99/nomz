import styled from 'styled-components';

export const StyledReviewForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 2%;
  height: 100%;
  width: 100%;
`;

export const TextInput = styled.textarea`
  width: 100%;
  resize: none;
  border: 3px solid rgb(196, 196, 196);
  border-radius: 10px;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 18px;
  color: rgb(136, 136, 136);
  padding: 15px 0px 5px 10px;
  margin-bottom: 10px;
`;

export const SubmitComponent = styled.div`
  width: 100%
  margin-top: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
