import { gql } from "@apollo/client";

export const SUBMIT_REIMBURSEMENT_MUTATION = gql`
  mutation SubmitReimbursement(
    $showId: ID!
    $receiptUrl: String!
    $notes: String
    $paymentMethod: String!
    $amount: String!
  ) {
    submitReimbursement(
      showId: $showId
      receiptUrl: $receiptUrl
      notes: $notes
      paymentMethod: $paymentMethod
      amount: $amount
    ) {
      success
      errors
      reimbursement {
        id
        showName
        amount
        paymentMethod
        receiptUrl
      }
    }
  }
`;
