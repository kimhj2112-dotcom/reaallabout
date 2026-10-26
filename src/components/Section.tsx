import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';

interface Props {
  title: string;
  sub?: string;
  more?: string;
  children: ReactNode;
}

export default function Section({ title, sub, more, children }: Props) {
  return (
    <section className="section">
      <div className="section__head">
        <div>
          <h2 className="section__title">{title}</h2>
          {sub && <p className="section__sub">{sub}</p>}
        </div>
        {more && (
          <Link to={more} className="section__more">
            더보기 <Icon name="chevronRight" size={16} />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
