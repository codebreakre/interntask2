import styles from './image.module.css'

export const ImageView = ({value} : {
    value:string
}) => {
  return (
    <img
      src={value}
      alt=""
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src =
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD5I6rmopyWwV1PTE_1DTlck9JDRl7JnyakA&s";
      }}
      className={styles.image}
    />
  );
};