import axios from "axios";
import useSWR, { mutate } from "swr";
import Link from "next/link";
import { useState } from "react";

type Bookmark = {
  id: number;
  title: string;
  url: string;
};

const fetcher = async (url: string) => {
  const res = await axios.get(url);
  return res.data;
};

const Index = () => {
  const [title, setTitle] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const { data, error } = useSWR<Bookmark[]>("/api/bookmark", fetcher);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (data) {
      await axios.post("/api/bookmark", { title, url }).then((res) => {
        setTitle("");
        setUrl("");
        mutate("/api/bookmark");
      });
    }
  };

  const handleUpdate = async (id: number) => {
    if (data) {
      await axios.put(`/api/bookmark/${id}`, { title, url }).then((res) => {
		setTitle("");
        setUrl("");
        mutate("/api/bookmark");
      });
    }
  };

  const handleDelete = async (id: number) => {
	if (data) {
	  await axios.delete(`/api/bookmark/${id}`).then((res) => {
		mutate("/api/bookmark");
	  });
	}
  };

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <div>
      <h1 className="text-3xl border-b pb-2">Bookmarks</h1>
      <h2 className="text-2xl mt-6 mb-4">Bookmark Form</h2>
      <form action="" onSubmit={handleSubmit}>
        <p>Title</p>
        <input
          type="text"
          name="title"
          id="title"
          value={title}
          className="bg-black border px-2 block"
          onChange={(e) => setTitle(e.target.value)}
        />
        <p>URL</p>
        <input
          type="text"
          name="url"
          id="url"
          value={url}
          className="bg-black border px-2 block"
          onChange={(e) => setUrl(e.target.value)}
        />
        <input type="submit" value="CREATE" className="border px-2 mt-4" />
      </form>
      <h2 className="text-2xl mt-6 mb-4">Bookmark List</h2>
      <div className="flex">
        <p className="w-48 text-center">Title</p>
        <p className="w-48 text-center">URL</p>
      </div>
      {data.map((bookmark: Bookmark, index: number) => {
        if (bookmark.url !== undefined) {
          return (
            <div key={bookmark.id} className="flex">
              <p className="bg-black border px-2 w-48">{bookmark.title}</p>
              <p className="bg-black border px-2 w-48">{bookmark.url}</p>
			  <button
          		className="border px-2"
          		onClick={() => handleUpdate(bookmark.id)}
        		>
	        	UPDATE
        	  </button>
			  <button
          		className="border px-2"
          		onClick={() => handleDelete(bookmark.id)}
       		  >DELETE</button>
              <Link target="_blank" className="border px-2" href={bookmark.url}>
                LINK
              </Link>
            </div>
          );
        }
      })}
    </div>
  );
};

export default Index;