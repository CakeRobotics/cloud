import Cake

class mybot(Cake.Robot):

	def __init__(self):
		Cake.log("Robot initializing.")
		mycamera = Cake.Devices.Camera(connection="usb")
		mywheels = Cake.Devices.Wheels(
			steering="differential",
			connection="gpio",
			driver="rs12")
		self.navigation = Cake.GroundNavigation(
			camera=mycamera,
			wheels=mywheels,
			storage_mode="cloud",
			storage_key="m2-farzan/room1")
		Cake.log("Robot initialized.")
		

	async def find_red_x(self):
		target = Cake.VisualObject(
			sample_images_path="images/red_x/")
		red_x = await Cake.findInRoom(
			self.navigation,
			target, 
			max_time="1 hr")
		if red_x.state == "found":
			Cake.log(f"Found at {red_x.location.to_string()}")
		else:
			Cake.log("Could not find the red X.")
			return red_x.location


	async def loop(self):
		if self.red_x_location:
			await Cake.moveTo(
				self.navigation, 
				self.red_x_location)
		else:
			await self.red_x_location = self.find_red_x()
		await Cake.moveTo(
			self.navigation,
			self.navigation.startingPoint)
