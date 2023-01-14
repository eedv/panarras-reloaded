type Props = {
  name: string;
  picture: string;
};

const Avatar = ({ name, picture }: Props) => {
  return (
    <div className="flex items-center">
      <div className="text-xl">Escrito por: </div>
      <div className="text-xl font-bold"> {name}</div>
    </div>
  );
};

export default Avatar;
