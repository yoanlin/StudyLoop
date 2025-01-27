import React from "react";

const FieldPage = async ({ params }: RouteParams) => {
  const { id } = await params;
  return <div>Field Page: {id}</div>;
};

export default FieldPage;
