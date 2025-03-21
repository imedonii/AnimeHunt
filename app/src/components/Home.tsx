import styles from './style.module.less';
import logo from '../assets/AnimeHunt logo.svg';
import { FaDownload, FaSearch } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Sharingan } from './Sharingan/Sharingan';

interface ApiResponse {
  data: any;
}

interface ErrorResponse {
  response?: {
    data: any;
  };
  message: string;
}

export const Home = () => {
  const [url, setUrl] = useState<string>('');
  const [loader, setLoader] = useState<boolean>(false);
  const [readyDownload, setReadyDownload] = useState<boolean>(false);
  const [downloadUrls, setDownloadUrls] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [showSharingan, setShowSharingan] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loader) {
        setShowSharingan(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [loader]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUrl(e.target.value);
  };

  const handleKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (e.key === 'Enter') {
      try {
        setLoader(true);
        const response: ApiResponse = await axios.post(
          'http://localhost:5000/extract',
          { url },
        );

        console.log('respones', response);

        if (response.data) {
          const urls = response.data.map(
            (item: { request_url: string }) => item.request_url,
          );
          setDownloadUrls(urls);
        }

        setLoader(false);
        setReadyDownload(true);
      } catch (error) {
        const err = error as ErrorResponse;
        setError(err.response?.data.error);
        setLoader(false);
      }
    }
  };

  if (showSharingan) {
    return <Sharingan />;
  }

  return (
    <div className={styles.content}>
      {loader && (
        <div className={styles.theLoader}>
          <div className={styles.loader}></div>
        </div>
      )}
      {!readyDownload && (
        <div className={styles.searchBar}>
          <img src={logo} alt="Anime Hunt" />
          <div className={styles.inputWrapper}>
            <FaSearch className={styles.icon} />
            <input
              type="text"
              placeholder="Paste the link to download any Anime"
              value={url}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}

      {readyDownload && (
        <div className={styles.downloadButtons}>
          {downloadUrls.map((url, index) => (
            <div key={index} className={styles.downloadButton}>
              <a href={url} target="_blank" rel="noopener noreferrer">
                <button>
                  <FaDownload />
                  {`Link ${index + 1}`}
                </button>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
