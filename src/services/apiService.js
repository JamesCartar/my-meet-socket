export const createRoom = async (body) => {
    try {
        const respond = await fetch('http://my-meet-v1.eba-kn9prvmi.ap-southeast-1.elasticbeanstalk.com//rooms/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
        const data = await respond.json();
        return data;
    } catch (error) {
      throw error; // Handle or propagate the error as needed
    }
};

export const getRoomData = async (roomId) => {
  try {
      const respond = await fetch('http://my-meet-v1.eba-kn9prvmi.ap-southeast-1.elasticbeanstalk.com//rooms/' + roomId, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
      })
      const data = await respond.json();
      return data;
  } catch (error) {
    throw error; // Handle or propagate the error as needed
  }
};

export const joinARoom = async (body) => {
  try {
    const respond = await fetch('http://my-meet-v1.eba-kn9prvmi.ap-southeast-1.elasticbeanstalk.com//rooms/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
    const data = await respond.json();
    return data;
  } catch (error) {
    throw error; // Handle or propagate the error as needed
  }
}