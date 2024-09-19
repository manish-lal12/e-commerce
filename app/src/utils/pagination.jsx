const pagination = (data) => {
  const itemsPerPage = 6;
  const numOfPages = Math.ceil(data.length / itemsPerPage);

  const pages = Array.from({ length: numOfPages }, (_, index) => {
    const start = index * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  });
  return pages;
};

export default pagination;
