// our-domain.com/new-meetup/[details]
import { MongoClient, ObjectId } from "mongodb";
import MeetupDetail from "../../components/meetups/MeetupDetails";

function MeetupDetails(props) {
  
  return (
    <MeetupDetail
      image={props.meetupData.image}
      title={props.meetupData.title}
      address={props.meetupData.address}
      description={props.meetupData.description}
    />
  );
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://A57c1992:A57c1992@cluster0.esg3msz.mongodb.net/meetups?retryWrites=true&w=majority"
  ); //never run this on the client side!!!
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, {_id: 1}).toArray();     //getting all the meetup data

  client.close();

  return {
    fallback: false,
    paths: meetups.map(meetup => ({
      params: {
        meetupId: meetup._id.toString(),
      }
    })), 
  };
};

export async function getStaticProps(context) {
  //fetch data for single meetup

  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    "mongodb+srv://A57c1992:A57c1992@cluster0.esg3msz.mongodb.net/meetups?retryWrites=true&w=majority"
  ); //never run this on the client side!!!
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  }); //needing access to a single meetup

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  };
};

export default MeetupDetails;
