import axios from "axios";
import { useRef, useState, useEffect, useCallback } from "react";

const apiClient = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

type Address = {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
};

type Company = {
  name: string;
  catchPhrase: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  username: string;
  img?: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
};

const NUM_PER_PAGE = 2;

const Gender: string[] = ["male", "female"];

const imageUrl = (name: string): string => {
  const randomGender = Gender[Math.floor(Math.random() * Gender.length)];
  const trimedName = name.split(" ")[0].trim().toLowerCase();
  return `https://avatars.dicebear.com/api/${randomGender}/${trimedName}.svg`;
};

const Avatars = () => {
  const [page, setPage] = useState(-1);
  const [userData, setUserData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  const loadInitialData = useCallback((p: number) => {
    setLoading(true);
    apiClient
      .get<User[]>("users", {
        params: {
          _start: p * NUM_PER_PAGE,
          _limit: NUM_PER_PAGE,
        },
      })
      .then((resp) => {
        const modifiedList = resp.data.map((d) => ({
          ...d,
          img: imageUrl(d.name),
        }));
        if (p == 0) {
          setUserData(modifiedList);
        } else {
          setUserData((d) => [...d, ...modifiedList]);
        }
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (page <= 5) {
      loadInitialData(page);
    }
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 1, rootMargin: "200px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.disconnect();
    };
  }, [ref]);

  return (
    <div>
      {userData.map((user: User) => {
        return (
          <div className="card" key={user.email}>
            {user.img ? (
              <>
                <div className="img">
                  <img className="img" src={user.img} alt={user.name} />
                </div>
                <div className="infos">
                  <div className="name">
                    <h2>{user.name}</h2>
                    <h4>{user.email}</h4>
                  </div>
                  <p className="text">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum
                  </p>
                  <ul className="stats">
                    <li>
                      <h3>15K</h3>
                      <h4>Views</h4>
                    </li>
                    <li>
                      <h3>82</h3>
                      <h4>Projects</h4>
                    </li>
                    <li>
                      <h3>1.3M</h3>
                      <h4>Followers</h4>
                    </li>
                  </ul>
                  <div className="links">
                    <button className="follow">Follow</button>
                    <button className="view">View profile</button>
                  </div>
                </div>
              </>
            ) : (
              <p>{JSON.stringify(user)}</p>
            )}
          </div>
        );
      })}
      <div ref={ref} style={{ width: "100%", height: "100px" }}>
        {loading && <div className="spinner" />}
      </div>
    </div>
  );
};

export default Avatars;
