import styles from "./image.module.css";
interface ImageView {
  value: File | string;
  onRemove: () => void;
}

export const ImageView = ({ value, onRemove }: ImageView) => {
  const imgSource = typeof value === 'string' ? value : URL.createObjectURL(value);
  return (
    <>
        <div className={styles.imageContainer}>
          <img
            src={imgSource}
            alt=""
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD5I6rmopyWwV1PTE_1DTlck9JDRl7JnyakA&s";
            }}
            className={styles.image}
          />
          <button
            className={styles.button}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
              
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
            </svg>
          </button>
        </div>
    </>
  );
};

