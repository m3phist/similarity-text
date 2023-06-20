import { FC } from 'react';

import { Metadata } from 'next';
import LargeHeading from '@/ui/LargeHeading';
import Paragraph from '@/ui/Paragraph';
import DocumentationTabs from '@/components/DocumentationTabs';

import 'simplebar-react/dist/simplebar.min.css';

export const metadata: Metadata = {
  title: 'similarity API | Documentation',
  description: 'Free open-source text similarity API',
};

const page: FC = ({}) => {
  return (
    <div className="container max-w-xl mx-auto mt-12">
      <div className="flex flex-col items-center gap-6">
        <LargeHeading>Making a request</LargeHeading>
        <Paragraph>api/v1/similarity</Paragraph>
        <DocumentationTabs />
      </div>
    </div>
  );
};

export default page;
