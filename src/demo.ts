import RingCentral from "@rc-ex/core";

const rc = new RingCentral({
  server: process.env.RINGCENTRAL_SERVER_URL,
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
});

const main = async () => {
  await rc.authorize({
    jwt: process.env.RINGCENTRAL_JWT_TOKEN!,
  });

  // list all extension devices
  const r0 = await rc.restapi().account().extension().device().get();
  const devices = r0.records!.filter((d) => d.type === "OtherPhone");
  if (devices.length === 0) {
    console.log("No suitable devices found");
    return;
  }

  // fetch the credentials of a device
  const r = await rc
    .restapi()
    .account()
    .device(devices[0].id!)
    .sipInfo()
    .get();
  console.log(JSON.stringify(r, null, 2));

  await rc.revoke();
};
main();
