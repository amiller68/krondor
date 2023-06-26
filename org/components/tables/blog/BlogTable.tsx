import DataTable from 'react-data-table-component';
import { useRouter } from 'next/router';

const customStyles = {
  headRow: {
    style: {
      borderTopWidth: '2px',
      borderTopColor: '#000',
      borderTopStyle: 'solid',
      borderBottomWidth: '2px',
      borderBottomColor: '#000',
      borderBottomStyle: 'solid',
      fontWeight: 700,
    },
  },
};

export interface IBlogTable {
  apply: () => any[];
}

const BlogTable: React.FC<IBlogTable> = (props: IBlogTable) => {
  const { apply } = props;
  const router = useRouter();
  const overviewColumns = [
    {
      name: 'POST TITLE',
      selector: (row: any) => row.title,
      sortable: true,
    },
    {
      name: 'POST DATE',
      selector: (row: any) => row.date,
      sortable: true,
    },
  ];

  const ExpandedComponentOverView = ({ data }: any) => (
    <div className="flex flex-row text-white">
      <button
        className="w-full bg-[#CB3535] "
        onClick={async () => router.push('/blog/' + data.cid)}
      >
        Read More
      </button>
    </div>
  );

  // Get the date time from the timestamp
  return (
    <DataTable
      columns={overviewColumns}
      data={apply()}
      customStyles={customStyles}
      expandableRows
      expandableRowsComponent={ExpandedComponentOverView}
    />
  );
};

export default BlogTable;
