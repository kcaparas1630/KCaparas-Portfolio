import styles from './section-label.module.css';

interface Props {
  text: string;
  id?: string;
}

export function SectionLabel({ text, id }: Props) {
  return (
    <h2 className={styles.label} id={id} data-reveal>
      {text}
    </h2>
  );
}
