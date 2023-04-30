import { useCallback, useEffect, useState } from "react";
import { Configuration, OpenAIApi } from "openai";

function App() {
  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);

  const callbackChat = useCallback(() => {
    const handleClick = async () => {
      setLoading(true);
      try {
        const response = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: prompt,
          temperature: 0.7,
          max_tokens: 256,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });
        setPrompt("");
        setChats([
          ...chats,
          {
            type: "bot",
            value: response?.data?.choices[0]?.text,
          },
        ]);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    handleClick();
  }, [chats, openai]);

  const handleChatUser = (text) => {
    setChats([
      ...chats,
      {
        value: text,
        type: "user",
      },
    ]);
  };

  useEffect(() => {
    if (
      chats.length > 0 &&
      !loading &&
      chats[chats.length - 1]?.type === "user"
    ) {
      callbackChat();
    }
  }, [chats, callbackChat, loading]);

  const string = JSON.stringify(chats)
  const parse = JSON.parse(string)
  const reverse = parse.reverse()

  return (
    <div className="w-full flex justify-center">
      <div className="mx-auto">
        <div className="mockup-phone border-primary ">
          <div className="camera"></div>
          <div className="display">
            <div className="artboard artboard-demo phone-1">
              <div className="mt-10  flex overflow-y-auto flex-col-reverse">
                {loading && (
                  <div className="chat chat-start">
                    <div className="chat-bubble chat-bubble-warning">
                      Sedang mengetik...
                    </div>
                  </div>
                )}
                {reverse?.map((chat, key) => {
                  return (
                    <div key={key}>
                      {chat.type === "user" ? (
                        <div className="chat chat-end">
                          <div className="chat-bubble chat-bubble-secondary">
                            {chat?.value}
                          </div>
                        </div>
                      ) : (
                        <div className="chat chat-start">
                          <div className="chat-bubble chat-bubble-success">
                            {chat?.value}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                <div className="chat chat-start">
                  <div className="chat-bubble chat-bubble-success">
                    Halo selamat datang di bot rizqi, tanya apapun aku akan coba
                    menjawabnya :)
                  </div>
                </div>
              </div>
              <div className="mt-auto mb-4 flex">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Tanya di sini</span>
                  </label>
                  <textarea
                    className="textarea textarea-info rounded-md"
                    placeholder="Tulis pertanyaanmu disini"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={loading}
                  ></textarea>
                </div>
                <button
                  className="btn btn-info mt-14 btn-sm ml-2"
                  onClick={() => handleChatUser(prompt)}
                  disabled={loading || prompt.length === 0}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
